/**
 * Helper получения названий экшенов на русском языке
 *
 */
export const actionsMap = {
    Edit: 'Редактировать',
    SendForApproval: 'Отправить на согласование',
    Delete: 'Удалить',
    Revoke: 'Отозвать для внесения изменений',
    Revert: 'Вернуть в согласованное состояние',
    Approve: 'Согласовать',
    Reject: 'Отклонить',
    Cancel: 'Отменить',
    History: 'Просмотреть историю изменений',
    Ticket: 'Купить билет',
    Report: 'Отправить отчет на согласование',
    ExpensesApprove: 'Согласовать доп. расходы',
    ExpensesReject: 'Отклонить доп. расходы',
}

export const statusTranslate = {
    Delete: 'Удалить',
    Revoke: 'Отозвать для внесения изменений',
    Revert: 'Вернуть в согласованное состояние',
    Approved: 'Согласовано',
    Rejected: 'Отклонено',
    Canceled: 'Отменено',
    Pending: 'ожидает согласования',
}

export const statusMap = {
    Draft: { className: 'c-gray', title: 'Черновик', iconName: 'common--edit' },
    Approval: { className: 'c-cornflower', title: 'На согласовании', iconName: 'common--time' },
    Approved: { className: 'c-green', title: 'Согласована', iconName: 'common--check' },
    Revoked: { className: 'c-gray', title: 'Отозвана', iconName: 'common--info' },
    InProgress: { className: 'c-cornflower', title: 'В командировке', iconName: 'common--flight', iconClassName: 'rotate' },
    Rejected: { className: 'c-red', title: 'Отклонена', iconName: 'common--info' },
    ExpenseApproval: { className: 'c-cornflower-2', title: 'Согласование доп. расходов', iconName: 'common--time' },
    Report: { className: 'c-black', title: 'Ожидает отчета', iconName: 'common--time' },
    RejectedReport: { className: 'c-red', title: 'Расход отклонен', iconName: 'common--info' },
    Complete: { className: 'c-gray', title: 'Завершена', iconName: 'common--check' },
    Cancelled: { className: 'c-red', title: 'Отменена', iconName: 'common--info' },
}


