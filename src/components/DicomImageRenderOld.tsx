import { useEffect, useState } from "react";
import { IDicomImageReaderProps } from "./DicomImageRender";
import { Box } from "@chakra-ui/react";
import CornerstoneViewport from 'react-cornerstone-viewport'
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneMath from 'cornerstone-math';
import Hammer from 'hammerjs';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

cornerstoneTools.init();

// Preferences
const fontFamily = 'Work Sans, Roboto, OpenSans, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif';
cornerstoneTools.textStyle.setFont(`16px ${fontFamily}`);
cornerstoneTools.toolStyle.setToolWidth(2);
cornerstoneTools.toolColors.setToolColor('rgb(255, 255, 0)');
cornerstoneTools.toolColors.setActiveColor('rgb(0, 255, 0)');

cornerstoneTools.store.state.touchProximity = 40;

// IMAGE LOADER
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.webWorkerManager.initialize({
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: true,
    taskConfiguration: {
        decodeTask: {
            initializeCodecsOnStartup: false,
            usePDFJS: false,
            strict: false,
        },
    },
});

interface IToolStateProps {
    tools: { name: string; mode: string; modeOptions?: { mouseButtonMask: number } | undefined }[];
    imageIds: (string | null)[];
}

export default function DicomImageReaderOld({ seriesinsuid, images }: IDicomImageReaderProps) {

    const [isLoaded, setIsLoaded] = useState(false);
    const [state, setState] = useState<IToolStateProps>({
        tools: [
            // Mouse
            {
                name: 'Wwwc',
                mode: 'active',
                modeOptions: { mouseButtonMask: 1 },
            },
            {
                name: 'Zoom',
                mode: 'active',
                modeOptions: { mouseButtonMask: 2 },
            },
            {
                name: 'Pan',
                mode: 'active',
                modeOptions: { mouseButtonMask: 4 },
            },
            // Scroll
            { name: 'StackScrollMouseWheel', mode: 'active' },
            // Touch
            { name: 'PanMultiTouch', mode: 'active' },
            { name: 'ZoomTouchPinch', mode: 'active' },
            { name: 'StackScrollMultiTouch', mode: 'active' },
        ],
        imageIds: [],
    });
    const [sopinsuid, setSopinsuid] = useState(images[0].sopinstanceuid);

    const fetchImage = async (sopinstanceuid: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_MYPACS_SERVER}/v1/api/pacs/images/${seriesinsuid}/${sopinstanceuid}`, { method: 'POST' });
            const buffer = await response.arrayBuffer();
            const imageId = `dicomweb:${await URL.createObjectURL(new Blob([buffer], { type: 'application/dicom' }))}`;
            // console.warn('imageId : ', imageId);

            return imageId;

        } catch (error) {
            console.error('Error fetching image:', error);

            return null;
        }
    }

    useEffect(() => {
        console.log('imageIds : ', state.imageIds);

    }, [state.imageIds]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        
        const fetchData = async () => {
            try {
                const imageIdPromises = images.map((image) => fetchImage(image.sopinstanceuid));
                const resolvedImageIds = await Promise.all(imageIdPromises.filter(id => id !== null));

                setState(prevState => {
                    return {
                        ...prevState,
                        imageIds: [...resolvedImageIds]
                    }
                });

                setIsLoaded(true);
                clearInterval(intervalId);

            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        if (!isLoaded) {
            intervalId = setInterval(() => {
                fetchData();
            }, 500);
        }
    }, []);

    return (
        <>
            <Box id="content">
                <CornerstoneViewport
                    tools={state.tools}
                    imageIds={state.imageIds}
                    style={{
                        width: '80vh',
                        height: '80vh',
                        margin: 'auto',
                        border: 'solid 1px, whitesmoke'
                    }} />
            </Box>
        </>
    );
}