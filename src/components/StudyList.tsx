import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Checkbox,
    CheckboxGroup,
    Center,
    Tfoot,
    HStack,
    IconButton,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import StudyPreviousModal from './StudyPreviousModal';
import { FcNext, FcPrevious } from 'react-icons/fc';

let pageSize = 5;

export interface IStudyProps {
    "modality": string;
    "imagecnt": number;
    "studydate": string;
    "studydesc": string;
    "reportstatus": number;
    "seriescnt": number;
    "verifyflag": number;
    "studykey": number;
    "patientkey": string;
    "pid": string;
    "pname": string;
}

interface IStudyList {
    "page": number;
    "pageSize": number;
}

export default function StudyList({page, pageSize} : IStudyList) {
    // Fetching
    const [isLoading, setIsLoading] = useState(true);
    const [studies, setStudies] = useState([]);
    const fetchStudies = async () => {
        const response = await fetch(`https://192.168.30.88:8443/v1/api/pacs/studies?page=${page}&pageSize=${pageSize}`, {method:'POST'});
        const json = await response.json();
        setStudies(json);
        setIsLoading(false);
    }
    useEffect(() => {
        fetchStudies();
    }, []);

    return (
        <>
            <TableContainer padding={'23px'}>
                <Table variant='simple' colorScheme='blue' fontSize={'sm'}>
                    <TableCaption color={'gray.300'}>MyPACS Study list @PACSPLUS-DATABASE</TableCaption>
                    <Thead bg={'blue.500'}>
                        <Tr>
                            <Th color='white'>환자 아이디</Th>
                            <Th color='white'>환자 이름</Th>
                            <Th color='white'>검사 장비</Th>
                            <Th color='white'>검사 설명</Th>
                            <Th color='white'>검사 일시</Th>
                            <Th color='white'>판독 상태</Th>
                            <Th color='white'>시리즈</Th>
                            <Th color='white'>이미지</Th>
                            <Th color='white'>Verify</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <CheckboxGroup>
                            {studies.map((study: IStudyProps) => (
                                <Tr key={study.studykey}>
                                    <Td><Checkbox value={study.studykey} />{study.pid}</Td>
                                    <Td><StudyPreviousModal pid={study.pid} pname={study.pname} /></Td>
                                    <Td>{study.modality}</Td>
                                    <Td>{study.studydesc}</Td>
                                    <Td>{study.studydate}</Td>
                                    <Td>{toStringReportStatus(study.reportstatus)}</Td>
                                    <Td>{study.seriescnt}</Td>
                                    <Td>{study.imagecnt}</Td>
                                    <Td>{study.verifyflag}</Td>
                                </Tr>
                            ))}
                        </CheckboxGroup>
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th colSpan={9}>
                                <Center mt={'10px'}>
                                    <HStack>
                                        <IconButton aria-label='Previous Page' icon={<FcPrevious />} />
                                        <IconButton aria-label='Next Page' icon={<FcNext />} />
                                    </HStack>                                 
                                </Center>
                            </Th>
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer >
        </>
    );
}

export function toStringReportStatus(status: number) {
    switch (status) {
        case 3:
            return "읽지않음";
        case 4:
            return "열람중";
        case 5:
            return "예비판독";
        case 6:
            return "판독";
    }
}