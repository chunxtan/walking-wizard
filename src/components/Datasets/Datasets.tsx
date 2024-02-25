import { LoginUserStore } from "../UserProfile/LoginSignUp/LoginUserStore"
import { MapboxMap } from "./Map"

type DatasetsProps = {
    userStore: LoginUserStore;
}

export const Datasets = ({ userStore }: DatasetsProps): React.JSX.Element => {
    return (
        <>
            <MapboxMap userStore={userStore} />
        </>
    )
}