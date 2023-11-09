import { Button } from "@chakra-ui/react";
import { Image as ChakraImage } from "@chakra-ui/react";
import FallbackImage from "../static/images/fallbackimg.jpg";
import { useEffect, useRef, useState } from "react";
import cornerstone, { RenderingEngine, init } from '@cornerstonejs/core';
import { ViewportType } from "@cornerstonejs/core/dist/esm/enums";

init();

interface IImageProps {
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
}

interface IDicomImageProps {
    "seriesinsuid": string;
}

export default function DicomImage({ seriesinsuid }: IDicomImageProps) {

    const [imageIds, setImageIds] = useState<Array<string>>();
    const [storagePath, setStoragePath] = useState('');
    const [images, setImages] = useState<Array<IImageProps>>([]);
    const datas = useRef<string[]>([]);
    const [index, setIndex] = useState(0);

    const fetchImages = async () => {
        try {
            const response = await fetch(`https://192.168.30.88:8443/v1/api/pacs/images/${seriesinsuid}`);
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
            setImageIds(ids);
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
            <ChakraImage src={`data:image/jpeg;base64,${datas.current[index]}`} fallbackSrc={FallbackImage} />
        </>
    );
}