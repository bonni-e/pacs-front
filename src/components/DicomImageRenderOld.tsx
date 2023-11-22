import { useEffect, useState } from "react";
import { IDicomImageReaderProps } from "./DicomImageRender";
import { Box } from "@chakra-ui/react";
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneMath from 'cornerstone-math';
import Hammer from 'hammerjs';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import Viewport from "./Viewport";

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

export default function DicomImageReaderOld({ seriesinsuid, images }: IDicomImageReaderProps) {

    const [isLoaded, setIsLoaded] = useState(false);
    const [imageIds, setImageIds] = useState<(string | null)[]>([]);

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
        const fetchData = async () => {
            try {
                const imageIdPromises = images.map((image) => fetchImage(image.sopinstanceuid));
                const resolvedImageIds = await Promise.all(imageIdPromises.filter(id => id !== null));
                setImageIds([...resolvedImageIds]);
                setIsLoaded(true);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        if (!isLoaded) {
            fetchData();
        }

        // console.log('imageIds : ', imageIds);
        // console.log('isLoaded : ', isLoaded);

    }, [isLoaded]);

    return (
        <>
            <Box id="content">
                {/* https://react.dev/learn/conditional-rendering#logical-and-operator- */}
                {isLoaded && <Viewport ids={imageIds} />}
            </Box>
        </>
    );
}