import { Box, Image } from "@chakra-ui/react";
import TestImage from "../static/images/test.jpg";
import FallbackImage from "../static/images/fallbackimg.jpg";
import { useEffect, useState } from "react";
import { RenderingEngine, init } from "@cornerstonejs/core";

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
    "seriesinsuid": string
}

export default function DicomImage({ seriesinsuid }: IDicomImageProps) {
    const [imageIds, setImageIds] = useState<Array<string>>();
    const [storagePath, setStoragePath] = useState('');
    const [images, setImages] = useState([]);
    const fetchImages = async () => {
        try {
            const response = await fetch(`https://192.168.30.88:8443/v1/api/pacs/images/${seriesinsuid}`);
            const json = await (response.json());
            setStoragePath(json.osServiceStorageRoot);
            setImages(json.list);

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
        init();
        const renderingEngineId = 'myRenderingEngine';
        const renderingEngine = new RenderingEngine(renderingEngineId);
        console.log("CHECK >>>");
    }
    useEffect(() => {
        // renderImages();
    }, [imageIds]);

    return (
        <>
            <Box id={seriesinsuid} w="fit-content">
                <Image src={TestImage} w={'100%'} fallbackSrc={FallbackImage} />
            </Box>
        </>
    );
}