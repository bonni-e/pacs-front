import { Box, Center, Divider, HStack, Input, Select, Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react";
import { m } from "framer-motion";

export default function SearchBar() {
    return (
        <Box margin={'23px'}>
            <HStack >
                <Input variant={'filled'} placeholder="환자아이디" />
                <Input variant={'filled'} placeholder="환자이름" />
                <Select variant={'filled'}>
                    <option value={''} selected disabled>판독상태</option>
                    <option value={'3'} >읽지않음</option>
                    <option value={'4'} >열람중</option>
                    <option value={'5'} >예비판독</option>
                    <option value={'6'} >판독</option>
                </Select>
            </HStack>
            <HStack mt={'20px'} justifyContent={'center'}>
                {['전체', '1일', '3일', '1주일', '재설정'].map((tagName) => (
                    <Tag size={'lg'} key={tagName} variant='outline' colorScheme='blackAlpha'>
                        <TagLabel>{tagName}</TagLabel>
                    </Tag>
                ))}
                <Center height='30px' margin={'0 15px 0 15px'}>
                    <Divider orientation='vertical' />
                </Center>
                {['다운로드', '검사삭제'].map((tagName) => (
                    <Tag size={'lg'} key={tagName} variant='outline' colorScheme='blackAlpha'>
                        <TagLabel>{tagName}</TagLabel>
                    </Tag>
                ))}
                <Select name='pagesize' w='10%' h={'32px'} borderColor={"blackAlpha.500"} color={"blackAlpha.900"} minW={'100px'}>
                    <option value={'5'} defaultChecked>5개씩 보기</option>
                    <option value={'10'}>10개씩 보기</option>
                    <option value={'20'}>20개씩 보기</option>
                </Select>
            </HStack>
        </Box>
    );
}