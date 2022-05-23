/**
 * ## HTML structure for all the /pages/*
 * It is a container component for each page,
 * adding a title and a description before the main content.
 *
 * @param props.title Title of the page
 * @param props.description Description of the page
 * @param props.children Main content
 * @param props.disableHeader Disable the title and description
 */
const Container = ({ title, description, children, disableHeader = false }: {
    title: string,
    description: string,
    children: React.ReactNode,
    disableHeader?: boolean,
}) => (
    <div className='animate__animated animate__fadeIn'>
        <div className='container mx-auto px-2 py-5'>
            { !disableHeader && (
                <div>
                    <h1 className='text-center text-4xl mt-10'>{title}</h1>
                    <br />
                    <p className='text-center'>{description}</p>
                    <br />
                    <hr />
                    <br />

                </div>
            )}
            {children}
        </div>
    </div>
)

export default Container
