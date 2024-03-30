import {
	Button,
	CircularProgress,
	DialogContent,
	DialogProps,
	Stack,
	Typography,
  } from "@mui/material";
  import { useLeaveQueueMutation } from "../store/features/Game/game.api.slice";
  
  interface WaitingQueueProps extends DialogProps {
	handleClose: () => void;
  }
  
  const WaitingQueue = ({ handleClose, open }: WaitingQueueProps) => {
	const [leaveQueue, leaveQueueAction] = useLeaveQueueMutation();
  
	const handleLeaveQueue = async () => {
	  try {
		await leaveQueue().unwrap();
		handleClose();
	  } catch (error) {
		/*  */
	  }
	  handleClose();
	};
  
	return (
		<DialogContent>
		  <Stack alignItems={"center"} justifyContent={"center"} spacing={5}>
			<CircularProgress size={100} />
			<Typography>Please wait</Typography>
			<Button
			  disabled={leaveQueueAction.isLoading}
			  variant="contained"
			  color="inherit"
			  onClick={handleLeaveQueue}
			>
			  Leave Queue
			</Button>
		  </Stack>
		</DialogContent>
	);
  };
  
  export default WaitingQueue;
  