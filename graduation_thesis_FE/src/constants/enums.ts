export default {
    workStatus: {
        new: 0,
        inProgress: 2,
        completed: 3,
        cancel: 4,
        abandon: 5
    },
    workType: {
        online: 0,
        offline: 1,
        hybrid: 2
    },
    userType: {
        client: 0,
        freelancer: 1
    },
    proposalStatus: {
        pending: 0,
        accept: 1,
        reject: 2,
        negotiating: 3
    },
    contractStatus: {
        new: 0,
        valid: 1,
        expired: 2,
        rejected: 3
    },
    refType: {
        JD: 0,
        proposal: 1,
        workProgress: 2,
        contract: 3,
        avatar: 4,
        userInfo: 5
    }
}