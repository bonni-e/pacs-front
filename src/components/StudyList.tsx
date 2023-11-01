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

export default function StudyList() {
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
                        <Tr>
                            <Td><Checkbox value='17192'>17192</Checkbox></Td>
                            <Td>강감찬</Td>
                            <Td>CT</Td>
                            <Td>CT BRAIN</Td>
                            <Td>20230319</Td>
                            <Td>읽지않음</Td>
                            <Td>7</Td>
                            <Td>173</Td>
                            <Td>아니오</Td>
                        </Tr>
                        <Tr>
                            <Td><Checkbox value='12345'>12345</Checkbox></Td>
                            <Td>강감찬</Td>
                            <Td>CT</Td>
                            <Td>CT BRAIN</Td>
                            <Td>20230319</Td>
                            <Td>읽지않음</Td>
                            <Td>7</Td>
                            <Td>173</Td>
                            <Td>아니오</Td>
                        </Tr>
                    </CheckboxGroup>
                </Tbody>
            </Table>
        </TableContainer >
    );
}