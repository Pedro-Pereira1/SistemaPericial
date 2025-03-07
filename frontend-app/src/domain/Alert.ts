interface Alert {
    id: string;
    title: string;
    category: string;
    subCategory: string;
    origin: string;
    assignedTo: string;
    status: string;
    creationTime: string;
    conclusionTime: string;
    description: string;
    resolution: string[];
    priority: string;
}

export default Alert;