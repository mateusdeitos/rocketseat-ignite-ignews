import { render } from '@testing-library/react'
import ActiveLink from '.';

jest.mock('next/router', () => ({
	useRouter: () => ({
		asPath: "/"
	})
}));

describe("ActiveLink tests", () => {
	it("should render ActiveLink", () => {
		const { getByText } = render(
			<ActiveLink activeClassName='active' href="/">
				<a>Home</a>
			</ActiveLink>
		);
		expect(getByText("Home")).toBeInTheDocument();
	})

	it("ActiveLink received activeClass", () => {
		const { getByText } = render(
			<ActiveLink activeClassName='blablabla' href="/">
				<a>Home</a>
			</ActiveLink>
		);
		expect(getByText("Home")).toHaveClass("blablabla");
	})
})