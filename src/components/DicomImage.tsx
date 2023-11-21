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
    Text,
} from "@chakra-ui/react";
import FallbackImage from "../static/images/fallbackimg.jpg";
import { useEffect, useRef, useState } from "react";
import DicomImageReader from "./DicomImageRender";
import DicomImageReaderOld from "./DicomImageRenderOld";

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

    const [storagePath, setStoragePath] = useState('');
    const [images, setImages] = useState<Array<IImageProps>>([]);
    const datas = useRef<string[]>([]);
    const [index, setIndex] = useState(0);

    const fetchImages = async () => {
        const apiUrl = `${process.env.REACT_APP_MYPACS_SERVER}`;

        try {
            const response = await fetch(`${apiUrl}/v1/api/pacs/images/${seriesinsuid}`);
            const json = await (response.json());
            setStoragePath(json.osServiceStorageRoot);
            setImages(json.list);
            datas.current = json.listDicomBase64;

            const ids = new Array<string>();
            images.map((image: IImageProps) => {
                // ImageId Format : root + path + filename
                const imageId = storagePath + image.path + image.fname;
                ids.push(imageId);
            });
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchImages();
    }, []);

    function renderImages() {

    }
    useEffect(() => {
        // renderImages();
    }, [datas]);

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
            <Button variant={"link"} colorScheme="red" style={{ position: "absolute" }}>{images[index]?.imagekey}</Button>
            <ChakraImage onDoubleClick={onOpen} src={`data:image/jpeg;base64,${datas.current[index]}`} fallbackSrc={FallbackImage} pointerEvents={"all"} />
            <Modal isOpen={isOpen} onClose={onClose} size={"full"}>
                <ModalOverlay />
                <ModalContent color={"blue.500"} bgColor={"blackAlpha.800"}>
                    <ModalCloseButton size={"lg"} mr={"27px"} />
                    <ModalHeader>
                        Series
                        <Text color="whitesmoke" fontSize={'medium'}>{seriesinsuid}</Text>
                    </ModalHeader>
                    <ModalBody>
                        <DicomImageReader seriesinsuid={seriesinsuid} images={images} />
                        {/* <DicomImageReaderOld seriesinsuid={seriesinsuid} images={images} /> */}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} colorScheme="blue" variant={"ghost"}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}