import { Html, Head, Main, NextScript } from 'next/document'

/*
	Links to external CSS must be here to avoid some problems during SSR
*/
export default function Document(): JSX.Element {
    return (
        <Html>
            <Head>
                {/* Bootstrap Icons */}
                <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.0/font/bootstrap-icons.css' />
                {/* Animate CSS */}
                <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css' />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
