import { makeStyles } from "@mui/styles";

// Le quitamos el (theme) de los parámetros y pasamos los valores a píxeles
export default makeStyles(() => ({
  formControl: {
    margin: '8px', minWidth: 120, marginBottom: '30px', width: '100%',
  },
  selectEmpty: {
    marginTop: '16px',
  },
  loading: {
    height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  container: {
    padding: '25px',
  },
  marginBottom: {
    marginBottom: '30px',
  },
  list: {
    height: '75vh', overflow: 'auto',
  },
}));