export const styles = (theme: any) => ({
    card : {
        position: 'sticky',
        display: 'inline-block',
        margin: '10px',
        border: '1px solid #ccc',
        borderRadius: '10px 10px',
        fontSize: '10px',
        width: '100px',
        textAlign: 'center',
        '& > img':{
            maxWidth: '100px',
            margin: 'auto',
        },
        '& > p' :{
            maxHeight: '25px',
            overflowY: 'auto',        
        },

    },
    selected: {
        borderColor: '#9ecaed',
        boxShadow: '0 0 10px #9ecaed',
    },
    anonymousCard:{
        borderRadius: '10px 10px',
    },
    text: {
        height: '35px',
        marginBottom:0,
        marginTop: 5,
    },
    icon:{
        width: '30px',
        position: 'absolute',
        left: '0',
        borderRadius: '10px 0 0 0',    
    },
    title: {
        marginBottom: 0,
        position: 'relative',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
    },
    smallerTitle: {
        fontSize: '8px',
        marginTop: '10px',
    },
    type: {
        textAlign: 'initial',
        marginLeft: '2px',
        fontSize: '6px',
        marginTop: '-10px',
    },
    instant: {
        color: '#e91f20',
    },
    basic: {
        color: '#6874b8',
    },
    magical: {
        color: '#1abaef',
    },
    magic: {
        color: '#8ac74f',
    },
    baby: {
        color: '#b96cac',
    },
    upgrade: {
        color: '#f68022',
    },
    downgrade: {
        color: '#fcca15',
    },
});