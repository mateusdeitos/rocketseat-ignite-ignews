import { ptBR } from "date-fns/locale";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { format } from "date-fns";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../services/prismic";
import Head from "next/head";
import styles from './post.module.scss';
import { Session } from "next-auth";

interface PostProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

const Post = ({ post }: PostProps) => {
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
                        className={styles.postContent}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const session = await getSession({ req }) as Session & { activeSubscription: object | null };
    const { slug } = params;

    if (!session.activeSubscription) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            }
        }
    }

    const prismic = getPrismicClient(req);
    const response = await prismic.getByUID('post', String(slug), {});

    return {
        props: {
            post: {
                slug,
                title: RichText.asText(response.data.title),
                content: RichText.asHtml(response.data.content),
                updatedAt: format(new Date(response.last_publication_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
            }
        }
    }

}

export default Post;