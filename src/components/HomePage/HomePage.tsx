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
            image: "src/assets/images/editDatasets.png"
        },
        { 
            title: "Choose your own scenario", 
            description: "Mix and match datasets for your analysis scenario - choose from both base and customised datasets.",
            image: "src/assets/images/chooseDatasets.png" 
        },
        { 
            title: "Get insightful results", 
            description: "Assess the accessibility of homes to key amenities within walking distance.",
            image: "src/assets/images/runAnalysis.png" 
        }
    ]
    return (
        <>
            <h1 id="welcome-title">🧙🔮 welcome to walking wizard 🔮🧙</h1>
            <div id="carousel">
            {
                isClient && carouselContent.map(content => {
                    return (     
                        <Card key={content.title}
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
