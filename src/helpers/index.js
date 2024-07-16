const addrTruncator = (addr) => {
    const start = addr.substring(0, 6);
    const end = addr.substring(addr.length - 4);
    return `${start}...${end}`;
}

export default addrTruncator;