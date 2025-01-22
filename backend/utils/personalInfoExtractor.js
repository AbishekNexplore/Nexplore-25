class PersonalInfoExtractor {
    constructor() {
        this.emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
        this.phoneRegex = /(?:\+\d{1,3}[-. ]?)?\b\d{3}[-. ]?\d{3}[-. ]?\d{4}\b/;
        this.linkedInRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?/;
        this.portfolioRegex = /(?:https?:\/\/)?(?:www\.)?(?:github\.com|[\w-]+\.[\w-]+)\/[\w-]+\/?/;
        this.locationRegex = /[A-Z][a-zA-Z\s]+(?:,\s*[A-Z]{2})?/;  // Made location pattern more flexible
    }

    extractName(text) {
        const lines = text.split('\n');
        // Try different name patterns
        const namePatterns = [
            /^(?:name:?\s*)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/i,
            /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/,
            /^([A-Z\s]{2,})/  // For names in all caps
        ];
        
        for (const line of lines.slice(0, 5)) { // Check first 5 lines
            const trimmedLine = line.trim();
            if (trimmedLine) {
                for (const pattern of namePatterns) {
                    const match = trimmedLine.match(pattern);
                    if (match) {
                        return match[1].trim();
                    }
                }
            }
        }
        return null;
    }

    extractEmail(text) {
        const match = text.match(this.emailRegex);
        return match ? match[0].toLowerCase() : null;
    }

    extractPhone(text) {
        const match = text.match(this.phoneRegex);
        return match ? match[0].replace(/[-. ]/g, '-') : null;
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
        const lines = text.split('\n');
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (this.locationRegex.test(trimmedLine)) {
                const match = trimmedLine.match(this.locationRegex);
                if (match && !trimmedLine.toLowerCase().includes('university')) {
                    return match[0];
                }
            }
        }
        return null;
    }

    extract(text) {
        const info = {
            name: this.extractName(text),
            email: this.extractEmail(text),
            phone: this.extractPhone(text),
            linkedin: this.extractLinkedIn(text),
            portfolio: this.extractPortfolio(text),
            location: this.extractLocation(text)
        };
        
        console.log('Extracted personal info:', info);
        return info;
    }
}

module.exports = new PersonalInfoExtractor();
