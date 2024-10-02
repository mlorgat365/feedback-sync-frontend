import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Link, colors } from '@mui/material';
import { Box } from '@mui/system';
import CustomTable from '../ui/CustomTable';
import { useState } from 'react';
import CustomModal from '../ui/CustomModal';
import { useSelector } from 'react-redux';

// Styles
const styles = {
    card: {
        display: 'flex',
        flexDirection: 'column',
        marginY: 2,
        borderRadius: 5,
    },
    cardContent: {
        paddingX: 4,
        paddingY: 4,
    },
    cardTitle: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
        paddingX: 2
    },
    tableContainer: {
        borderRadius: 5,
        boxShadow: 2,
    },
    tableHeader: {
        backgroundColor: '#E9E9E9',
        borderRadius: 5,
        fontSize: 16,
        fontWeight: 'bold'
    }
};

function RecievedFeedbacks({ feedbacks }) {
    const [openViewAll, setOpenViewAll] = useState(false);  // State for "View all" modal
    const [openFeedbackDetail, setOpenFeedbackDetail] = useState(false);  // State for feedback detail modal
    const [selectedFeedback, setSelectedFeedback] = useState(null);  // Store clicked feedback


    const handleClickOpenViewAll = () => setOpenViewAll(true);  // Open "View all" modal
    const handleCloseViewAll = () => setOpenViewAll(false);  // Close "View all" modal

    const handleRowClick = (feedbackRow) => {
        setSelectedFeedback(feedbackRow);  // Set the clicked feedback data
        setOpenFeedbackDetail(true);  // Open feedback detail modal
    };

    const handleCloseFeedbackDetail = () => {
        setOpenFeedbackDetail(false);  // Close feedback detail modal, keep "View All" open
    };




    // Ensure feedbacks is an array before mapping over it
    const columns = ['SR', 'Name', ' Preview', 'Date'];
    const rows = Array.isArray(feedbacks)
        ? feedbacks?.map((feedback, index) => [
            index + 1,
            feedback?.giverName,
            feedback?.content.length > 15
                ? `${feedback?.content.substring(0, 15)}...`  // Truncate feedback preview to 15 characters
                : feedback?.content,
            feedback?.createdAt
        ])
        : [];  // If feedbacks is not an array, fallback to an empty array

    return (
        <>
        
            <Card sx={styles.card}>
                <CardContent sx={styles.cardContent}>
                    <Box sx={styles.cardTitle}>
                        <Typography variant="h4">Recieved Feedbacks</Typography>
                        <Link href="#" variant="body2" onClick={handleClickOpenViewAll}  >
                            View all
                        </Link>
                    </Box>
                    {
                        (feedbacks?.length === 0 || feedbacks == null) ? (
                            <Typography variant='body2' sx={{
                                textAlign:'center',
                                padding:4,
                                color: colors.red[400]
                            }}  > No Feedback received till now. </Typography>
                        ): (
                            <CustomTable columns={columns} rows={rows?.slice(0, 6)} onRowClick={handleRowClick} />
                        )
                    }
                    
                </CardContent>
            </Card>

            {/* Modal for "View all" */}
            <CustomModal
                open={openViewAll}  // Keep this modal open all the time
                onClose={handleCloseViewAll}
                title="All Recieved Feedbacks"
                showSearch={false}  // Enable search in the "View all" modal
            >
                <CustomTable columns={columns} rows={rows} onRowClick={handleRowClick} />  {/* Display all feedbacks in the modal, with row click handler */}
            </CustomModal>

            {/* Modal for feedback detail when a row is clicked */}
            <CustomModal
                open={openFeedbackDetail}  // Open detail modal independently of the "View All" modal
                onClose={handleCloseFeedbackDetail}
                title="Feedback Details"
                showSearch={false}  // Disable search in the row click modal
            >
                {selectedFeedback ? (
                    <Box sx={{padding:2, gap:2}} >
                        <Typography variant="body1"><strong>Employee Name:</strong> {selectedFeedback[1]}</Typography>
                        <Typography
                            variant="body1"
                            sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}  // Enable text wrapping for feedback
                        >
                            <strong>Feedback:</strong> {feedbacks[selectedFeedback[0] - 1].feedbackPreview} {/* Display full feedback */}
                        </Typography>
                        <Typography variant="body1"><strong>Date:</strong> {selectedFeedback[3]}</Typography>
                    </Box>
                ) : (
                    <Typography variant="body2">No feedback selected.</Typography>
                )}
            </CustomModal>
        </>
    );
}

RecievedFeedbacks.propTypes = {
    feedbacks: PropTypes.arrayOf(PropTypes.shape({
        employeeName: PropTypes.string.isRequired,
        feedbackPreview: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
    })).isRequired,
};

// Set default props to prevent errors when no feedback is passed
RecievedFeedbacks.defaultProps = {
    feedbacks: [],
};

export default RecievedFeedbacks;