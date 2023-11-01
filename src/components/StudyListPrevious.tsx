import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text,
    Stack,
} from '@chakra-ui/react'

export default function StudyListPrevious() {
    return (
        <>  
            <Stack padding={'23px 23px 0 23px'} >
                <Text fontSize={'large'}>
                    Previous
                </Text>
                <Text fontSize={'sm'}>
                    환자 아이디 : 17192
                </Text>
                <Text fontSize={'sm'}>
                    환자 이름 : 강감찬
                </Text>
            </Stack>
            <TableContainer w={'50%'} padding={'23px'}>
                <Table variant='striped' colorScheme='blue' fontSize={'sm'} >
                    <Thead bg={'blue.500'}>
                        <Tr>
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
                        <Tr>
                            <Td>CT</Td>
                            <Td>CT BRAIN</Td>
                            <Td>20230319</Td>
                            <Td>읽지않음</Td>
                            <Td>7</Td>
                            <Td>173</Td>
                            <Td>아니오</Td>
                        </Tr>
                        <Tr>
                            <Td>CT</Td>
                            <Td>CT BRAIN</Td>
                            <Td>20230319</Td>
                            <Td>읽지않음</Td>
                            <Td>7</Td>
                            <Td>173</Td>
                            <Td>아니오</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer >
        </>
    );
}