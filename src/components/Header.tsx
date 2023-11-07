import { Box, Link, Text } from "@chakra-ui/react";
import { RiMentalHealthFill } from "react-icons/ri";

export default function Header() {
    return (
        <Link href="/pacs-front">
            <Box w="100%" textAlign={'center'} margin={'30px 0 30px 0'}>
                <Text
                    color='blue.500'
                    fontSize="5xl"
                    fontWeight="extrabold"
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <RiMentalHealthFill />MyPACS
                </Text>
            </Box>
        </Link>
    );
}