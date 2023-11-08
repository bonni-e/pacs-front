import { Box, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ISeriesProps } from "./SeriesViewer";
import { IStudyProps } from "./StudyList";

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

interface IImageViewerProps {
    "study" : IStudyProps;
    "series": ISeriesProps;
}

export default function ImageViewer({ study, series }: IImageViewerProps) {
    const [storagePath, setStoragePath] = useState('');
    const [images, setImages] = useState([]);
    const fetchImages = async () => {
        try {
            const response = await fetch(`https://192.168.30.88:8443/v1/api/pacs/images/${series.seriesinsuid}`);
            const json = await (response.json());
            setImages(json.list);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <>
            {/* {images.map((image:IImageProps) => ( */}
                    {study.pid}<br />
                    {study.pname}<br />
                    {study.pbirthdatetime}<br />
                    {series.seriesnum}<br />
                    {/* {image.imagekey}<br />
                    {image.pixelrows}<br />
                    {image.pixelcolumns}<br />
                    {image.window}<br />
                    {image.lev}<br /> */}
                    {series.seriesdate}<br />
                    {series.seriestime}<br />
                    {series.manufacturer}<br />
                    {series.manumodelname}<br />
                    {series.operatorsname}<br />
                    {study.pid}<br />
            {/* ))}; */}
        </>
    );
}