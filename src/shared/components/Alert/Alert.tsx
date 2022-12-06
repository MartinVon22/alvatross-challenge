import './Alert.css';

export const Alert = (props: any) => {

    const {title, success} = props;

    return (
        <div className={`alertContainer ${success ? 'success' : null}`}>
            {title}
        </div>
    )

}