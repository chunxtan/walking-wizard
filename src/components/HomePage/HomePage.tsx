import { Card } from 'flowbite-react';
import './HomePage.css';
import '@fontsource/silkscreen';
import { useState, useEffect } from 'react';

type HomePageCarousel = {
    title: string,
    description: string,
    image: string
}

export const HomePage = (): React.JSX.Element => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
    setIsClient(true); // Indicates client-side rendering
    }, []);

    const carouselContent: HomePageCarousel[] = [
        { 
            title: "Customise base datasets", 
            description: "Add new features or remove existing ones. Logged-in users will have their datasets saved.",
            image: "https://private-user-images.githubusercontent.com/99042026/309332659-aaec0529-9cc4-4dc4-975f-3ff968f601f8.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkzMTI2NTMsIm5iZiI6MTcwOTMxMjM1MywicGF0aCI6Ii85OTA0MjAyNi8zMDkzMzI2NTktYWFlYzA1MjktOWNjNC00ZGM0LTk3NWYtM2ZmOTY4ZjYwMWY4LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAzMDElMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMzAxVDE2NTkxM1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTE2YTRhYWRhMWFiZDMxM2VjODQyOWRmZjFhMDQyNzYzMGI3ZmNmYWQ2MjIwZWYwNWE1NmE3MGIxMThkNTg2YTAmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.U7OoC-QIl7BjBCsAogbOA3t8SAxdyAXkfz2lcM-L3qw"
        },
        { 
            title: "Choose your own scenario", 
            description: "Mix and match datasets for your analysis scenario - choose from both base and customised datasets.",
            image: "https://private-user-images.githubusercontent.com/99042026/309332682-7ca38fc7-52ba-4bfb-ba6b-8937c038f98c.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkzMTI2NTMsIm5iZiI6MTcwOTMxMjM1MywicGF0aCI6Ii85OTA0MjAyNi8zMDkzMzI2ODItN2NhMzhmYzctNTJiYS00YmZiLWJhNmItODkzN2MwMzhmOThjLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAzMDElMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMzAxVDE2NTkxM1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWU5ODczNzczM2NiNzBhOWU2ODhkNTMwNjVhYzY0NWY1NGIyN2U0M2FkNjExNDc1ODRhZmIxNGE3OTE4YzZkNzAmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.qFe8oaLS93dnStefhVinKqihGrZlL4LV6m5zrbsgtuA" 
        },
        { 
            title: "Get insightful results", 
            description: "Assess the accessibility of homes to key amenities within walking distance.",
            image: "https://private-user-images.githubusercontent.com/99042026/309332697-2de3dfff-2a67-4cd6-8410-553b152d4ba3.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkzMTI2NTMsIm5iZiI6MTcwOTMxMjM1MywicGF0aCI6Ii85OTA0MjAyNi8zMDkzMzI2OTctMmRlM2RmZmYtMmE2Ny00Y2Q2LTg0MTAtNTUzYjE1MmQ0YmEzLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAzMDElMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMzAxVDE2NTkxM1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTkyNGQ3MDMxNDc5YzYyNzJiOTQ0MzEwMDZiMzdiODMwNWU3YTBhZGMwNWI2NWMzNzRjMjYwMjgzMzI3ZmEzZmImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.lkncySPqh1dvXp8eOjkvVTOapep8tj4YtS6ZNh_UwTI" 
        }
    ]
    return (
        <>
            <h1 id="welcome-title">🧙🔮 welcome to walking wizard 🔮🧙</h1>
            <div id="carousel">
            {
                isClient && carouselContent.map(content => {
                    return (     
                        <Card
                        className="max-w-sm">
                        <img className="rounded-t-lg" src={content.image} alt="" />
                        <h5 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">
                            {content.title}
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400 text-xs">
                            {content.description}
                        </p>
                    </Card>
                  )
                })
            }
            </div>
        </>
    )
}
