import React from "react";
import styled from "styled-components";
import { Container } from "rsuite";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUserState } from "../../redux/store";

import SideBarNavigation from "../SideBarNavigation";

const AppPageContainer: React.FunctionComponent = ({ children }) => {
	const history = useHistory();

	const { isLoggedIn } = useSelector(selectAuthUserState);

	React.useEffect(() => {
		if (isLoggedIn === false) history.push("/");
	}, [isLoggedIn, history]);

	return (
		<Container>
			<SideBarNavigation />
			<Container>
				<StyledContainer>{children}</StyledContainer>
			</Container>
		</Container>
	);
};

const StyledContainer = styled.div`
	padding: 10px 10px 10px 10px;
	min-height: 100%;
	overflow: visible;
	border-left: 1px solid rgba(91, 91, 91, 0.3);
`;

export default AppPageContainer;
