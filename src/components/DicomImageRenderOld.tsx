import { useEffect, useRef, useState } from "react";
import { IDicomImageReaderProps } from "./DicomImageRender";
import { Box } from "@chakra-ui/react";
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
var config = {
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: true,
    taskConfiguration: {
        decodeTask: {
            initializeCodecsOnStartup: true,
        },
        sleepTask: {
            sleepTime: 3000,
        },
    },
};
cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

export default function DicomImageReaderOld({ seriesinsuid, images }: IDicomImageReaderProps) {

    const elementRef = useRef<HTMLCanvasElement | HTMLDivElement>();

    const [loaded, setLoaded] = useState(false);
    const [sopinsuid, setSopinsuid] = useState(images[0].sopinstanceuid);

    const fetchImage = async () => {
        const response = await fetch(`${process.env.REACT_APP_MYPACS_SERVER}/v1/api/pacs/images/${seriesinsuid}/${sopinsuid}`, { method: 'POST' });
        const buffer = await response.arrayBuffer();
        renderImage(sopinsuid, buffer);
    }

    useEffect(() => {
        fetchImage();
    }, [sopinsuid]);

    useEffect(() => {
        const content = document.getElementById('content');
        const element = document.createElement('div');
        element.id = 'element';
        element.style.width = '80vh';
        element.style.height = '80vh';
        element.style.border = 'solid 1px whitesmoke';
        element.style.margin = 'auto';
        content?.appendChild(element);

        elementRef.current = element;

        return () => {
            const element = elementRef.current;
            element && element.remove();
        };
    }, []);

    function renderImage(sopinsuid: string, buffer: ArrayBuffer) {
        const imageId = `dicomweb:${URL.createObjectURL(new Blob([buffer], { type: 'application/dicom' }))}`;
        console.warn('imageId : ', imageId);

        cornerstone.enable(elementRef.current);
        cornerstone.loadImage(imageId)
            .then(function (image: any) {
                console.log('image : ', image);
                const viewport = cornerstone.getDefaultViewportForImage(elementRef.current, image);
                cornerstone.displayImage(elementRef.current, image, viewport);
                if (loaded === false) {
                    // cornerstoneTools.mouseInput.enable(elementRef.current);
                    // cornerstoneTools.mouseWheelInput.enable(elementRef.current);
                    // cornerstoneTools.wwwc.activate(elementRef.current, 1); // ww/wc is the default tool for left mouse button
                    // cornerstoneTools.pan.activate(elementRef.current, 2); // pan is the default tool for middle mouse button
                    // cornerstoneTools.zoom.activate(elementRef.current, 4); // zoom is the default tool for right mouse button
                    // cornerstoneTools.zoomWheel.activate(elementRef.current); // zoom is the default tool for middle mouse wheel
                    setLoaded(true);
                }
            }, function (err: any) {
                console.error(err);
            });

    }

    return (
        <>
            <Box id="content"></Box>
        </>
    );
}