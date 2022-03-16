import { useRouter } from 'next/router';
import Link, { LinkProps } from 'next/link';
import { cloneElement } from 'react';

interface ActiveLinkProps extends LinkProps {
	activeClassName: string;
};


const ActiveLink: React.FC<ActiveLinkProps> = ({ children, activeClassName, ...rest }) => {
	const { asPath } = useRouter();
	const className = asPath === rest.href ? activeClassName : "";

	return <Link {...rest}>
		{cloneElement(children as React.ReactElement, { className })}
	</Link>
}

export default ActiveLink;