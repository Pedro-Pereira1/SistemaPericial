interface Alert {
    id: string;
    type: string;
    subType: string;
    origin: string;
    assignedTo: string;
    status: string;
    creationTime: string;
    conclusionTime: string;
    description: string;
    resolution: string[];
}

export default Alert;