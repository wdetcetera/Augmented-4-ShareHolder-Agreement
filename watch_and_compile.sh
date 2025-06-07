#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Define the target file
TARGET_FILE="shareholders_agreement.tex"

# Function to compile LaTeX document
compile_latex() {
    echo -e "${YELLOW}Changes detected! Starting compilation...${NC}"
    
    # Clean up old files
    rm -f ${TARGET_FILE%.tex}.aux ${TARGET_FILE%.tex}.log ${TARGET_FILE%.tex}.out ${TARGET_FILE%.tex}.pdf
    
    # First pdflatex run
    echo -e "${YELLOW}First pdflatex run...${NC}"
    pdflatex -interaction=nonstopmode ${TARGET_FILE}
    
    # Second pdflatex run for references
    echo -e "${YELLOW}Second pdflatex run...${NC}"
    pdflatex -interaction=nonstopmode ${TARGET_FILE}
    
    if [ -f ${TARGET_FILE%.tex}.pdf ]; then
        echo -e "${GREEN}PDF successfully created!${NC}"
        echo -e "${GREEN}File size: $(ls -lh ${TARGET_FILE%.tex}.pdf | awk '{print $5}')${NC}"
        
        # Open the PDF (macOS specific)
        open ${TARGET_FILE%.tex}.pdf
    else
        echo -e "${RED}Error: PDF creation failed!${NC}"
        exit 1
    fi
}

# Check if fswatch is installed
if ! command -v fswatch &> /dev/null; then
    echo -e "${RED}fswatch is not installed. Installing via Homebrew...${NC}"
    if ! command -v brew &> /dev/null; then
        echo -e "${RED}Homebrew is not installed. Please install Homebrew first.${NC}"
        exit 1
    fi
    brew install fswatch
fi

# Initial compilation
compile_latex

# Watch for changes in .tex files
echo -e "${GREEN}Watching for changes in .tex files...${NC}"
fswatch -o \
    ${TARGET_FILE} \
    sections/*.tex | while read f; do
    compile_latex
done 