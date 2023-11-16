const DeniedComponent = () => {
    const queryStrings = new URLSearchParams(window.location.search);
    const error = queryStrings.get('error');
    return (
        <>
            <main className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col justify-center items-center px-6 mx-auto h-screen xl:px-0 dark:bg-gray-900">
                    <div className="text-center ">
                        {/* <h1 className="mb-3 text-2xl capitalize font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">Access denied</h1> */}
                        <p className="mb-5 text-base font-normal text-gray-500 md:text-lg dark:text-gray-400">
                            {`Access denied: ${error?.toUpperCase() || "You have no permission to access this page"}`}
                        </p>
                    </div>
                </div>
            </main>

        </>
    )
}

export default DeniedComponent;