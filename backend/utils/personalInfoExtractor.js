class PersonalInfoExtractor {
    constructor() {
        this.emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
        this.phoneRegex = /(?:\+\d{1,3}[-. ]?)?\b\d{3}[-. ]?\d{3}[-. ]?\d{4}\b/;
        this.linkedInRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?/;
        this.portfolioRegex = /(?:https?:\/\/)?(?:www\.)?(?:github\.com|[\w-]+\.[\w-]+)\/[\w-]+\/?/;
        this.locationRegex = /[A-Z][a-zA-Z\s]+,\s*[A-Z]{2}/;
    }

    extractName(text) {
        // Simple name extraction - first line or after "Name:" pattern
        const lines = text.split('\n');
        const namePattern = /^(?:name:?\s*)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/i;
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine) {
                const match = trimmedLine.match(namePattern);
                if (match) {
                    return match[1];
                }
            }
        }
        return null;
    }

    extractEmail(text) {
        const match = text.match(this.emailRegex);
        return match ? match[0] : null;
    }

    extractPhone(text) {
        const match = text.match(this.phoneRegex);
        return match ? match[0] : null;
    }

    extractLinkedIn(text) {
        const match = text.match(this.linkedInRegex);
        return match ? match[0] : null;
    }

    extractPortfolio(text) {
        const match = text.match(this.portfolioRegex);
        return match ? match[0] : null;
    }

    extractLocation(text) {
        const match = text.match(this.locationRegex);
        return match ? match[0] : null;
    }

    extractAll(text) {
        return {
            name: this.extractName(text),
            email: this.extractEmail(text),
            phone: this.extractPhone(text),
            linkedIn: this.extractLinkedIn(text),
            portfolio: this.extractPortfolio(text),
            location: this.extractLocation(text)
        };
    }
}

module.exports = new PersonalInfoExtractor();
