import { Box, Text } from "@chakra-ui/react";

export default function Footer() {
    return (
        <Box w={'100%'} h={'200px'} bg={'blackAlpha.100'} padding={'23px'} mt={'30px'}>
            <Text color={'gray.600'}>
                address
            </Text>
        </Box>
    );
}