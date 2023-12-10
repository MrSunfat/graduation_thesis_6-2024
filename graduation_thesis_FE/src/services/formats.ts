const formatCurrency = (money: number) =>
    money?.toLocaleString('it-IT', {
        style: 'currency',
        currency: 'VND',
    });
const formatDate = (date: Date) => new Date(date).toLocaleString('vi-VN');

export { formatCurrency, formatDate };
