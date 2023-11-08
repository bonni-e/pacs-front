import { useEffect, useState } from "react";
import { IDicomViewerModalProps } from "./DicomViewerModal";
import { Box, Divider, HStack, IconButton, Stack } from "@chakra-ui/react";
import ImageViewer from "./ImageViewer";
import { BsZoomIn, BsZoomOut } from "react-icons/bs";

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

    const [width, setWidth] = useState("40vh");
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

    function zoonOut() {
        const w = parseInt(width.split('vh')[0]);
        if(w >= 40) {
            setWidth((w-10)+"vh");
        }
    }

    function zoonIn() {
        const w = parseInt(width.split('vh')[0]);
        if (w <= 90) {
            setWidth((w + 10) + "vh");
        }
    }

    return (
        <>
            <HStack spacing={1} justifyContent={"flex-end"} >
                <IconButton onClick={zoonOut} aria-label="" colorScheme="blue" variant={"ghost"} icon={<BsZoomOut />} />
                <IconButton onClick={zoonIn} aria-label="" colorScheme="blue" variant={"ghost"} icon={<BsZoomIn />} />
            </HStack>
            <Divider margin={'5px 0 30px 0'} />
            <Stack>
                <HStack wrap={"wrap"}>
                    {series.map((series: ISeriesProps) => (
                        <Box className="view-box" w={width} h={width} color={"whitesmoke"} bgColor={"blackAlpha.900"} padding={'15px 17px 15px 15px'}>
                            <ImageViewer study={study} series={series} />
                        </Box>
                    ))}
                </HStack>
            </Stack>
        </>
    );
}