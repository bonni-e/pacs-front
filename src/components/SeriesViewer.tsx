import { useEffect, useState } from "react";
import { IDicomViewerModalProps } from "./DicomViewerModal";
import { Box, HStack, Stack } from "@chakra-ui/react";
import ImageViewer from "./ImageViewer";

export interface ISeriesProps {
    "studykey": number;
    "serieskey": number;
    "studyinsuid": string;
    "seriesinsuid": string;
    "seriesnum": number;
    "seriescurseqnum": number;
    "modality": string;
    "bodypart": string;
    "seriesdesc": string;
    "protocolname": string;
    "imagecnt": number;
    "seriesdate": string;
    "seriestime": string;
    "performingphysicianname": string;
    "operatorsname": string;
    "patposition": string;
    "manufacturer": string;
    "institutionname": string;
    "stationname": string;
    "manumodelname": string;
    "nonimagecount": number;
    "filesize": number;
}

export default function DicomViewer({ study }: IDicomViewerModalProps) {
    let count = 0;

    const [series, setSeries] = useState([]);
    const fetchSeries = async () => {
        try {
            const response = await fetch(`https://192.168.30.88:8443/v1/api/pacs/series/${study.studykey}`);
            const json = await response.json();
            setSeries(json);
        } catch (error) {
            console.log(error);            
        }
    }
    useEffect(() => {
        fetchSeries();
    }, []);

    return (
        <>
            <Stack>
                <HStack wrap={"wrap"}>
                    {series.map((series: ISeriesProps) => (
                        <Box id="content" w='33vh' h='30vh' color={"whitesmoke"} bgColor={"blackAlpha.900"}>
                            <ImageViewer study={study} series={series} />
                        </Box>
                    ))}
                </HStack>
            </Stack>
        </>
    );
}