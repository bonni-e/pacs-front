import {
    Image as ChakraImage,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    ModalOverlay,
    Skeleton,
    Text,
} from "@chakra-ui/react";
import FallbackImage from "../static/images/fallbackimg.jpg";
import { useEffect, useRef, useState } from "react";
import DicomImageReader from "./DicomImageRender";
import DicomImageReaderOld from "./DicomImageRenderOld";
import CursorPan from '../static/images/switch_right_FILL0_wght400_GRAD0_opsz24.png';

export interface IImageProps {
    "path": string;
    "fname": string;
    "delflag": number;
    "studykey": number;
    "serieskey": number;
    "imagekey": number;
    "studyinsuid": string;
    "seriesinsuid": string;
    "sopinstanceuid": string;
    "sopclassuid": string;
    "ststorageid": number;
    "pixelrows": number;
    "pixelcolumns": number;
    "window": number;
    "lev": number;
    "transfersyntaxuid": string;
}

export interface IDicomImageProps {
    "seriesinsuid": string;
}

export default function DicomImage({ seriesinsuid }: IDicomImageProps) {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const datas = useRef<string[]>([]);

    const [isLoaded, setIsLoaded] = useState(false);
    const [images, setImages] = useState<Array<IImageProps>>([]);
    const [index, setIndex] = useState(0);

    const fetchImages = async () => {
        const apiUrl = `${process.env.REACT_APP_MYPACS_SERVER}`;

        try {
            const response = await fetch(`${apiUrl}/v1/api/pacs/images/${seriesinsuid}`);
            const json = await (response.json());
            setImages(json.list);
            datas.current = json.listDicomBase64;
            setIsLoaded(true);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchImages();
    }, []);

    useEffect(() => {
        document.getElementById(seriesinsuid)?.addEventListener('click', (e) => {
            if (index > 0) {
                setIndex(index - 1);
            }
        });
        document.getElementById(seriesinsuid)?.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (index < datas.current.length - 1) {
                setIndex(index + 1);
            }
        });
    }, [index])

    return (
        <>
            <Skeleton
                isLoaded={isLoaded}
                startColor="blue.500"
                endColor="blue.900"
                w={'100%'}
            >
                <Button
                    variant={"link"}
                    colorScheme="red"
                    style={{ position: "absolute", top: '20vh' }}
                >
                    {images[index]?.imagekey}
                </Button>
                <ChakraImage
                    onDoubleClick={onOpen}
                    src={`data:image/jpeg;base64,${datas.current[index]}`}
                    fallbackSrc={FallbackImage}
                    pointerEvents={"all"}
                    w={'100%'}
                    cursor={`url(${CursorPan}), auto`}
                />
                <Modal isOpen={isOpen} onClose={onClose} size={"full"}>
                    <ModalOverlay />
                    <ModalContent color={"blue.500"} bgColor={"blackAlpha.800"}>
                        <ModalCloseButton size={"lg"} mr={"27px"} />
                        <ModalHeader>
                            Series
                            <Text fontSize={"medium"} color={'RGBA(255,255,255,0.3)'}>{seriesinsuid}</Text>
                        </ModalHeader>
                        <ModalBody>
                            {/* <DicomImageReader seriesinsuid={seriesinsuid} images={images} /> */}
                            <DicomImageReaderOld seriesinsuid={seriesinsuid} images={images} />
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onClose} colorScheme="blue" variant={"ghost"}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Skeleton>
        </>
    );
}