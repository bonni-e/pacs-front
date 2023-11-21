import { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
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
const {
    WindowLevelTool,
    StackScrollMouseWheelTool,
    ZoomTool,
    ToolGroupManager,
    Enums: csToolsEnums,
} = cornerstoneTools;
const { MouseBindings } = csToolsEnums;
const { ViewportType } = Enums;


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

cornerstoneTools.addTool(WindowLevelTool);
cornerstoneTools.addTool(StackScrollMouseWheelTool);
cornerstoneTools.addTool(ZoomTool);

const toolGroupId = 'myToolGroup';
const viewportId = 'CT_AXIAL_STACK';
const renderingEngineId = 'myRenderingEngine';


// Define a tool group, which defines how mouse events map to tool commands for
// Any viewport using the group
const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);


export interface IDicomImageReaderProps {
    "seriesinsuid": string;
    "images": Array<IImageProps>
}

export default function DicomImageReader({ seriesinsuid, images }: IDicomImageReaderProps) {

    const isLoaded = useRef(false);
    const elementRef = useRef<HTMLDivElement>(null);

    const [sopinsuid, setSopinsuid] = useState(images[0].sopinstanceuid);

    const fetchImage = async () => {
        const response = await fetch(`${process.env.REACT_APP_MYPACS_SERVER}/v1/api/pacs/images/${seriesinsuid}/${sopinsuid}`, { method: 'POST' });
        const buffer = await response.arrayBuffer();
        renderImage(sopinsuid, buffer);
    }

    useEffect(() => {
        if (!isLoaded.current) {
            fetchImage().then(() => {
                const element = elementRef.current;

                // Set tools
                if (toolGroup) {
                    console.log('add and set tools');
                    toolGroup.addViewport(viewportId, renderingEngineId);

                    // Add tools to the tool group
                    toolGroup.addTool(WindowLevelTool.toolName);
                    toolGroup.addTool(ZoomTool.toolName);
                    toolGroup.addTool(StackScrollMouseWheelTool.toolName);

                    // Set the initial state of the tools, here all tools are active and bound to
                    // Different mouse inputs
                    toolGroup.setToolActive(WindowLevelTool.toolName, {
                        bindings: [
                            {
                                mouseButton: MouseBindings.Primary, // Left Click
                            },
                        ],

                    });
                    toolGroup.setToolActive(ZoomTool.toolName, {
                        bindings: [
                            {
                                mouseButton: MouseBindings.Secondary, // Right Click
                            },
                        ],
                    });

                    // As the Stack Scroll mouse wheel is a tool using the `mouseWheelCallback`
                    // hook instead of mouse buttons, it does not need to assign any mouse button.
                    toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
                }
            })
        }
        return () => {
            isLoaded.current = true;
            console.warn('isLoaded : ', isLoaded.current)
        }
    }, []);

    function renderImage(sopinsuid: string, arrayBuffer: ArrayBuffer) {
        let imageId = `dicomweb:${URL.createObjectURL(new Blob([arrayBuffer], { type: 'application/dicom' }))}`;
        console.warn('imageId : ', imageId);

        // Instantiate a rendering engine
        const renderingEngine = new RenderingEngine(renderingEngineId);

        // Create a stack viewport

        renderingEngine.enableElement({
            viewportId,
            type: ViewportType.STACK,
            element: elementRef.current as HTMLDivElement
        });

        // Get the stack viewport that was created
        let viewport = {} as Types.IStackViewport
        viewport = renderingEngine.getViewport(viewportId) as Types.IStackViewport;

        // Set the stack on the viewport
        const start = new Date().getTime();

        viewport.setStack([imageId]);
        viewport.render();
    }

    return (
        <>
            <Box id="content">
                <Box ref={elementRef} w={'80vh'} h={'80vh'} margin={'auto'} border={'solid 1px whitesmoke'}></Box>
            </Box>
        </>
    );
}