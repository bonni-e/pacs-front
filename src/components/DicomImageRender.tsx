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

cornerstone.init();

cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;
cornerstoneDICOMImageLoader.configure({
    useWebWorkers: true,
    decodeConfig: {
        convertFloatPixelDataToInt: false,
    },
});

var config = {
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: true,
    taskConfiguration: {
        decodeTask: {
            initializeCodecsOnStartup: true
        },
        sleepTask: {
            sleepTime: 3000,
        },
    }
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

export interface IDicomImageReaderProps {
    "seriesinsuid": string;
    "images": Array<IImageProps>
}

export default function DicomImageReader({ seriesinsuid, images }: IDicomImageReaderProps) {
    const elementRef = useRef<HTMLCanvasElement | HTMLDivElement>();

    const [dataset, setDataset] = useState<dicomParser.DataSet>();
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

    function renderImage(sopinsuid: string, arrayBuffer: ArrayBuffer) {

        let imageId = `dicomweb:${URL.createObjectURL(new Blob([arrayBuffer], { type: 'application/dicom' }))}`;
        console.warn('imageId : ', imageId);

        // Instantiate a rendering engine
        const renderingEngineId = 'myRenderingEngine';
        const renderingEngine = new RenderingEngine(renderingEngineId);

        // Create a stack viewport
        const viewportId = 'CT_STACK';
        renderingEngine.enableElement({
            viewportId,
            type: ViewportType.STACK,
            element: elementRef.current as HTMLDivElement,
            // defaultOptions: {
            //     background: [0.2, 0, 0.2] as Types.Point3,
            // },
        });

        // Get the stack viewport that was created
        viewport = renderingEngine.getViewport(viewportId) as Types.IStackViewport;

        toolGroup?.addViewport(viewportId, renderingEngineId);
        // Set the stack on the viewport
        const start = new Date().getTime();

        viewport.setStack([imageId]);
        viewport.render();
    }

    return (
        <>
            <Box id="content">
                <Text>{dataset?.string('x0020000d')}</Text>
            </Box>
        </>
    );
}