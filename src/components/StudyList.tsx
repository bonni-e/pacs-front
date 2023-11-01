import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Checkbox,
    CheckboxGroup
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';

interface IStudyProps {
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

export default function StudyList() {
    // Fetching
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [studies, setStudies] = useState([]);
    const fetchStudies = async() => {
        const response = await fetch(`http://192.168.30.88:8080/v1/api/pacs/studies?page=${page}`);
        const json = await response.json();
        setStudies(json);
        setIsLoading(false);
    }
    useEffect(() => {
        fetchStudies();
        console.log(studies);
    }, []);

    return (
        <TableContainer padding={'23px'}>
            <Table variant='striped' colorScheme='blue' fontSize={'sm'}>
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
                            <Tr>
                                <Td><Checkbox value={study.patientkey}>{study.patientkey}</Checkbox></Td>
                                <Td>{study.pname}</Td>
                                <Td>{study.modality}</Td>
                                <Td>{study.studydesc}</Td>
                                <Td>{study.studydate}</Td>
                                <Td>{study.reportstatus}</Td>
                                <Td>{study.seriescnt}</Td>
                                <Td>{study.imagecnt}</Td>
                                <Td>{study.verifyflag}</Td>
                            </Tr>
                        ))}
                    </CheckboxGroup>
                </Tbody>
            </Table>
        </TableContainer >
    );
}