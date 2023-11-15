import { useEffect, useRef, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import * as cornerstone from '@cornerstonejs/core';
import {
    RenderingEngine,
    Types,
    Enums,
} from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import dicomParser from 'dicom-parser';
import { IImageProps } from "./DicomImage";
import { ImageLoaderFn } from "@cornerstonejs/core/dist/esm/types";


cornerstone.init();

cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;
var config = {
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: true,
};
cornerstoneDICOMImageLoader.webWorkerManager.initialize(config);

const {
    PanTool,
    WindowLevelTool,
    StackScrollMouseWheelTool,
    ZoomTool,
    ToolGroupManager,
    Enums: csToolsEnums,
} = cornerstoneTools;

const { MouseBindings } = csToolsEnums;
const { ViewportType } = Enums;
const element = document.querySelector(
    '#cornerstone-element'
) as HTMLDivElement;

const toolGroupId = 'myToolGroup';
let viewport = {} as Types.IStackViewport

cornerstoneTools.addTool(PanTool);
cornerstoneTools.addTool(WindowLevelTool);
cornerstoneTools.addTool(StackScrollMouseWheelTool);
cornerstoneTools.addTool(ZoomTool);

// Define a tool group, which defines how mouse events map to tool commands for
// Any viewport using the group
const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

// Add tools to the tool group
toolGroup?.addTool(WindowLevelTool.toolName);
toolGroup?.addTool(PanTool.toolName);
toolGroup?.addTool(ZoomTool.toolName);
toolGroup?.addTool(StackScrollMouseWheelTool.toolName);

// Set the initial state of the tools, here all tools are active and bound to
// Different mouse inputs
toolGroup?.setToolActive(WindowLevelTool.toolName, {
    bindings: [
        {
            mouseButton: MouseBindings.Primary, // Left Click
        },
    ],
});
toolGroup?.setToolActive(PanTool.toolName, {
    bindings: [
        {
            mouseButton: MouseBindings.Auxiliary, // Middle Click
        },
    ],
});
toolGroup?.setToolActive(ZoomTool.toolName, {
    bindings: [
        {
            mouseButton: MouseBindings.Secondary, // Right Click
        },
    ],
});

// As the Stack Scroll mouse wheel is a tool using the `mouseWheelCallback`
// hook instead of mouse buttons, it does not need to assign any mouse button.
toolGroup?.setToolActive(StackScrollMouseWheelTool.toolName);


interface Uids {
    [key: string]: string;
}

interface IDicomImageReaderProps {
    "seriesinsuid": string;
    "images": Array<IImageProps>
}

export default function DicomImageReader({ seriesinsuid, images }: IDicomImageReaderProps) {

    const elementRef = useRef<HTMLCanvasElement | HTMLDivElement>();

    const [data, setData] = useState<Uint8Array>();
    const [dataset, setDataset] = useState<dicomParser.DataSet>();
    const [sopinsuid, setSopinsuid] = useState(images[0].sopinstanceuid);

    useEffect(() => {
        const content = document.getElementById('content');
        const element = document.createElement('canvas');
        element.id = 'element';
        element.style.width = '80vh';
        element.style.height = '80vh';
        element.style.border = 'solid 1px whitesmoke';
        content?.appendChild(element);

        elementRef.current = element;

        return () => {
            const element = elementRef.current;
            element && element.remove();
        };
    }, []);

    useEffect(() => {
        renderImage(sopinsuid);
    }, [sopinsuid]);

    function renderImage(sopinsuid: string) {
        cornerstone.imageLoader.registerImageLoader('mypacs', loadImage as ImageLoaderFn);

        const imageId = `mypacs://${seriesinsuid}/${sopinsuid}`;
        console.log('imageId : ', imageId);

        // Instantiate a rendering engine
        const renderingEngineId = 'myRenderingEngine';
        const renderingEngine = new RenderingEngine(renderingEngineId);

        // Create a stack viewport
        const viewportId = 'CT_STACK';
        renderingEngine.enableElement({
            viewportId,
            type: ViewportType.STACK,
            element: elementRef.current as HTMLDivElement
        });

        // Get the stack viewport that was created
        viewport = renderingEngine.getViewport(viewportId) as Types.IStackViewport;

        toolGroup?.addViewport(viewportId, renderingEngineId);
        // Set the stack on the viewport
        const start = new Date().getTime();

        viewport.setStack([imageId]);
        viewport.render();
    }

    function parseImageId(imageId: string) {
        const url = `https://localhost:8443/v1/api/pacs/images/1.2.410.200119.10101001.30031.20230404102357400017.102/1.2.410.200119.10101001.30031.20230404102357400017.102.1`;
        return url;
    }

    function createImageObject(arrayBuffer: ArrayBuffer) {
        // 압축된 포맷으로부터 PixelData를 얻어옴
        const dataSet = dicomParser.parseDicom(new Uint8Array(arrayBuffer));
        let frameIndex = dataSet.intString('x00280008');
        if (frameIndex)
            frameIndex -= 1;
        let transferSyntaxUID = dataSet.string('x00020010');
        if (transferSyntaxUID)
            transferSyntaxUID = transferSyntaxUID.split('(')[0];

        // wadors://{SeriesInstanceUID}/{SOPInstanceUID}
        const seriesInstanceUID = dataSet.string('x0020000E');
        const SOPInstanceUID = dataSet.string('x00080018');
        const imageId = `mypacs://${seriesInstanceUID}/${SOPInstanceUID}`;

        const imageFrame = cornerstoneDICOMImageLoader.wadouri.getEncapsulatedImageFrame(
            dataSet,
            frameIndex
        )
        console.log('imageFrame : ', imageFrame); // = pixelData

        // imageId와 pixelData로 이미지 객체 생성 
        const image = cornerstoneDICOMImageLoader.createImage(
            imageId, imageFrame, transferSyntaxUID
        );
    }

    function loadImage(imageId: string) {
        // Parse the imageId and return a usable URL (logic omitted)
        const url = parseImageId(imageId);

        // Create a new Promise
        const promise = new Promise((resolve, reject) => {
            // Inside the Promise Constructor, make
            // the request for the DICOM data
            const oReq = new XMLHttpRequest();
            oReq.open('post', url, true);
            oReq.responseType = 'arraybuffer';
            oReq.onreadystatechange = function (oEvent) {
                if (oReq.readyState === 4) {
                    if (oReq.status == 200) {
                        // Request succeeded, Create an image object (logic omitted)
                        const image = createImageObject(oReq.response);

                        // Return the image object by resolving the Promise
                        resolve(image);
                    } else {
                        // An error occurred, return an object containing the error by
                        // rejecting the Promise
                        reject(new Error(oReq.statusText));
                    }
                }
            };
            oReq.send();
        });
        // Return an object containing the Promise to cornerstone so it can setup callbacks to be
        // invoked asynchronously for the success/resolve and failure/reject scenarios.

        return {
            promise,
        };
    }

    return (
        <>
            <Box id="content">
                <Text>{dataset?.string('x0020000d')}</Text>
            </Box>
        </>
    );
}