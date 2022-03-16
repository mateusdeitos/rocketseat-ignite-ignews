import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock';
import { useSession } from 'next-auth/client'
import { SignInButton } from '.';

jest.mock("next-auth/client")

describe("SignInButton tests", () => {
	it("When not authenticated", () => {
		const useSessionMock = mocked(useSession);
		useSessionMock.mockReturnValueOnce([null, false]);

		render(<SignInButton />);

		expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
	});
	it("When authenticated", () => {
		const useSessionMock = mocked(useSession);
		const name = "John Doe";
		useSessionMock.mockReturnValue([{ user: { name }, expires: "1231" }, false]);
		render(<SignInButton />);

		expect(screen.getByText(name)).toBeInTheDocument();
	});
})