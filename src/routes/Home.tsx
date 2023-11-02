
import { Divider } from "@chakra-ui/react";
import Header from "../components/Header";
import StudyList from "../components/StudyList";
import StudyListPrevious from "../components/StudyPreviousList";
import SearchBar from "../components/SearchBar";

function Home() {
    return (
        <>
            <SearchBar />
            <StudyList />
            <Divider />
        </>
    );
}

export default Home;