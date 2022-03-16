import { render, screen } from '@testing-library/react'
import { Header } from '.';

jest.mock('next/router', () => ({
	useRouter: () => ({
		asPath: "/"
	})
}));

jest.mock("next-auth/client", () => ({
	useSession: () => [null, false]
}))

describe("Header tests", () => {
	it("Header renders", () => {
		render(<Header />);
		expect(screen.getByText("Home")).toBeInTheDocument();
		expect(screen.getByText("Posts")).toBeInTheDocument();
	})
})