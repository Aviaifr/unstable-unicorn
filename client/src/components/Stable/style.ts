export const styles = (theme: any) => ({
    stable:{
        width: '95%',
        margin: 'auto',
    },
    downup : {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: '-30px',
        '& > div':{
            minWidth: '100px',
            minHeight: '100px',
        }
    },
    unicorns:{
        width: '100%',
        height: '200px',
        border: '1px solid black'
    },
    highlight: {
        border: '1px solid #f6ff54',
        boxShadow: '0 0 10px #f6ff54',
    },
});