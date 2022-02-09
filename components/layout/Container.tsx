const Container = ({ title, description, children }) => (
    <div className='animate__animated animate__fadeIn'>
        <div className='container mx-auto px-2 py-5'>
            <h1 className='text-center text-4xl mt-10'>{title}</h1>
            <br />
            <p className='text-center'>{description}</p>
            <br />
            <hr />
            <br />
            {children}
        </div>
    </div>
)

export default Container
