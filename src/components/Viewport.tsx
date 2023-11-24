import { Box, HStack, Image, Text } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import CornerstoneViewport from 'react-cornerstone-viewport'
import Left from '../static/images/left.png';
import Right from '../static/images/right.png';
import Both from '../static/images/both.png';
import Wheel from '../static/images/wheel.png';
import Scroll from '../static/images/scroll.png';
import { BsFillEraserFill } from "react-icons/bs";
import CursorWindow from '../static/images/brightness_6_FILL0_wght400_GRAD0_opsz24.png';
import CursorZoom from '../static/images/go_GoZoomIn.png';
import CursorGrab from '../static/images/hand_bones_FILL0_wght400_GRAD0_opsz24.png';
import CursorEraser from '../static/images/bs_BsFillEraserFill.png';
import CursorRuler from '../static/images/tb_TbRuler2Off.png';

export interface IViewportProps {
    ids: (string | null)[]
}
export default function Viewport({ ids }: IViewportProps) {

    const [green, blue] = ['RGBA(0, 255, 0, 1)', 'RGBA(156, 206, 249, 1)'];

    const [activeTool, setActiveTool] = useState('Wwwc');
    const [color, setColor] = useState({
        Wwwc: green,
        Zoom: blue,
        Bidirectional: blue,
        Pan: blue,
        PrevNext: blue,
        Eraser: blue,
    });
    const state = useRef({
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
            // Annotation
            {
                name: 'Bidirectional',
                mode: 'active',
                modeOptions: {
                    mouseButtonMask: 3
                }
            },
            // Eraser
            {
                name: 'Eraser',
                mode: 'active'
            }
        ],
        imageIds: ids,
    });

    function switchTool(toolName: string) {
        setColor(prevColor => {
            return {
                ...prevColor,
                [activeTool]: blue,
                [toolName]: green
            }
        });
        setActiveTool(toolName);
        setCursor();
    }

    function setCursor() {
        switch (activeTool) {
            case 'Wwwc':
                handleCursorWindow();
                break;
            case 'Zoom':
                handleCursorZoom();
                break;
            case 'Bidirectional':
                handleCursorBidirectional();
                break;
            case 'Pan':
                handleCursorPan();
                break;
            case 'Eraser':
                handleCursorEraser();
        }
    }

    function handleCursorBidirectional() {
        document.body.style.cursor = `url(${CursorRuler}), auto`;
    }

    function handleCursorEraser() {
        document.body.style.cursor = `url(${CursorEraser}), auto`;
    }

    function handleCursorWindow() {
        document.body.style.cursor = `url(${CursorWindow}), auto`;
    }

    function handleCursorMouse(event: React.MouseEvent) {
        if (event.button === 1) {
            handleCursorPan()
        } else if (event.button === 2) {
            handleCursorZoom();
        }
    }

    function handleCursorPan() {
        document.body.style.cursor = `url(${CursorGrab}), auto`;
    }

    function handleCursorZoom() {
        document.body.style.cursor = `url(${CursorZoom}), auto`;
    }

    function hadleCursorNone() {
        document.body.style.cursor = `auto`;
    }

    return (
        <Box
            id="content"
            onMouseEnter={setCursor}
            onMouseLeave={hadleCursorNone}
            onMouseDown={handleCursorMouse}
            onMouseUp={setCursor}
            w={'80vh'}
            h={'80vh'}
            margin={'auto'}
        >
            <HStack justifyContent={'center'} color={'RGBA(0, 255, 0, 1)'} mb={'15px'} textAlign={'center'}>
                <Image src={Left} w={'11px'} />
                <Text onClick={() => switchTool('Wwwc')} cursor={'pointer'} color={color.Wwwc} mr={'5px'}>Window Level</Text>
                <Image src={Right} w={'11px'} />
                <Text onClick={() => switchTool('Zoom')} cursor={'pointer'} color={color.Zoom} mr={'5px'}>Zoom</Text>
                <Image src={Both} w={'11px'} />
                <Text onClick={() => switchTool('Bidirectional')} cursor={'pointer'} color={color.Bidirectional} mr={'5px'}>Bidirectional</Text>
                <Image src={Wheel} w={'11px'} />
                <Text onClick={() => switchTool('Pan')} cursor={'pointer'} mr={'5px'} color={color.Pan}>Move</Text>
                <Image src={Scroll} w={'11px'} />
                <Text mr={'5px'} color={color.PrevNext}>Prev/Next</Text>
                <BsFillEraserFill />
                <Text onClick={() => switchTool('Eraser')} cursor={'pointer'} color={color.Eraser} mr={'5px'}>Erase</Text>
            </HStack>
            <CornerstoneViewport
                tools={state.current.tools}
                imageIds={state.current.imageIds}
                activeTool={activeTool}
                style={{ border: `solid 1px ${blue}` }}
            />
        </Box>
    );
}