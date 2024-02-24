import { LoginUserStore } from "../UserProfile/LoginSignUp/LoginUserStore"
import { Map } from "./Map"

type DatasetsProps = {
    userStore: LoginUserStore;
}

export const Datasets = ({ userStore }: DatasetsProps): React.JSX.Element => {
    return (
        <>
            <Map userStore={userStore} />
        </>
    )
}