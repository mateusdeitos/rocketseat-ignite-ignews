import { ptBR } from "date-fns/locale";
import { GetStaticProps } from "next";
import { useSession } from "next-auth/client";
import { format } from "date-fns";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../../services/prismic";
import Head from "next/head";
import styles from '../post.module.scss';
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";

interface PostProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

const Post = ({ post }: PostProps) => {
    const [session] = useSession();
    const router = useRouter();

    useEffect(() => {
        // @ts-ignore
        if (session?.activeSubscription) {
            router.push(`/posts/${post.slug}`)
        }
    }, [session])
    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href="/">
                            <a >Subscribe now</a>
                        </Link>
                         🤗

                    </div>
                </article>
            </main>
        </>
    )
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params;

    const prismic = getPrismicClient();
    const response = await prismic.getByUID('post', String(slug), {});

    return {
        props: {
            post: {
                slug,
                title: RichText.asText(response.data.title),
                content: RichText.asHtml(response.data.content.splice(0, 3)),
                updatedAt: format(new Date(response.last_publication_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
            }
        }
    }

}

export default Post;