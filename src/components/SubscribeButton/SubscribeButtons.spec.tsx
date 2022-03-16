import { render, screen, fireEvent } from '@testing-library/react'
import { mocked } from 'jest-mock';
import { useSession, signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { SubscribeButton } from '.';

jest.mock("next-auth/client")
jest.mock("next/router")

describe("SubscribeButton tests", () => {
	it("Renders correctly", () => {
		const useSessionMock = mocked(useSession);
		const name = "John Doe";
		useSessionMock.mockReturnValue([{ user: { name }, expires: "1231" }, false]);
		render(<SubscribeButton>Subscribe now</SubscribeButton>);

		expect(screen.getByText("Subscribe now")).toBeInTheDocument();
	});

	it("Redirect to sign in when not authenticated", () => {
		const useSessionMock = mocked(useSession);
		useSessionMock.mockReturnValue([null, false]);

		const signInMock = mocked(signIn);
		render(<SubscribeButton>Subscribe now</SubscribeButton>);

		const subscribeButton = screen.getByText("Subscribe now");
		fireEvent.click(subscribeButton);

		expect(signInMock).toHaveBeenCalledWith('github');
	});

	it("Redirect to posts when user already has a subscription", () => {
		const useSessionMock = mocked(useSession);
		const name = "John Doe";
		useSessionMock.mockReturnValue([{ user: { name }, expires: "1231", activeSubscription: "123123" }, false]);

		const pushMocked = jest.fn();
		const useRouterMock = mocked(useRouter);
		useRouterMock.mockReturnValue({
			push: pushMocked
		} as any);

		render(<SubscribeButton>Subscribe now</SubscribeButton>);

		const subscribeButton = screen.getByText("Subscribe now");
		fireEvent.click(subscribeButton);

		expect(pushMocked).toHaveBeenCalledWith('/posts');
	})
})