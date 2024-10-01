"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Edit2,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";

interface TableRow {
  id: number;
  values: string[];
}

export default function TracingTableGenerator() {
  const [tableName, setTableName] = useState("Моя трассировочная таблица");
  const [headers, setHeaders] = useState(["i", "x", "y"]);
  const [rows, setRows] = useState<TableRow[]>([
    { id: 1, values: ["", "", ""] },
  ]);
  const [editingHeader, setEditingHeader] = useState<number | null>(null);
  const [visibleColumnStart, setVisibleColumnStart] = useState(0);

  const addRow = () => {
    const newRow = { id: Date.now(), values: Array(headers.length).fill("") };
    setRows([...rows, newRow]);
  };

  const removeRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const updateCell = (rowId: number, columnIndex: number, value: string) => {
    setRows(
      rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              values: row.values.map((v, i) => (i === columnIndex ? value : v)),
            }
          : row
      )
    );
  };

  const addColumn = () => {
    setHeaders([...headers, `Столбец ${headers.length + 1}`]);
    setRows(rows.map((row) => ({ ...row, values: [...row.values, ""] })));
  };

  const removeColumn = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
    setRows(
      rows.map((row) => ({
        ...row,
        values: row.values.filter((_, i) => i !== index),
      }))
    );
    if (visibleColumnStart >= headers.length - 1) {
      setVisibleColumnStart(Math.max(0, visibleColumnStart - 1));
    }
  };

  const exportToPDF = () => {
    try {
      console.log("Начало экспорта PDF");
      const doc = new jsPDF();
      console.log("jsPDF инициализирован");
      try {
        doc.addFont(
          "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
          "Roboto",
          "normal"
        );
        doc.setFont("Roboto");
        console.log("Шрифт Roboto загружен и установлен");
      } catch (fontError) {
        console.error("Ошибка при загрузке шрифта:", fontError);
        doc.setFont("helvetica");
        console.log("Установлен резервный шрифт helvetica");
      }
      doc.setFontSize(16);
      doc.text(tableName, 14, 15);
      console.log("Заголовок добавлен");
      console.log("Начало создания таблицы");
      autoTable(doc, {
        head: [headers],
        body: rows.map((row) => row.values),
        startY: 25,
        styles: {
          font: "Roboto",
          fontSize: 10,
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        bodyStyles: {
          textColor: [50, 50, 50],
        },
        theme: "grid",
      });
      console.log("Таблица создана");
      doc.save(`${tableName}.pdf`);
      console.log("PDF сохранен");
    } catch (error) {
      console.error("Ошибка при создании PDF:", error);
      alert(
        "Произошла ошибка при создании PDF. Пожалуйста, проверьте консоль для получения дополнительной информации."
      );
    }
  };

  const visibleHeaders = headers.slice(
    visibleColumnStart,
    visibleColumnStart + 3
  );
  const canScrollLeft = visibleColumnStart > 0;
  const canScrollRight = visibleColumnStart + 3 < headers.length;

  return (
    <Card className="w-full max-w-4xl mx-auto mt-12 mb-12">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Генератор трассировочных таблиц
        </CardTitle>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Трассировочная таблица - это мощный инструмент для анализа и отладки
          программного кода. Она позволяет пошагово отслеживать изменения
          переменных и состояний программы во время выполнения, что особенно
          полезно при проведении тестирования методом "холостого прогона"
          (Dry-Run testing). С помощью трассировочных таблиц разработчики могут
          легко выявлять логические ошибки и проблемы в алгоритмах, визуализируя
          процесс выполнения кода и его влияние на данные.
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label htmlFor="tableName" className="text-sm font-medium">
            Название таблицы
          </Label>
          <Input
            id="tableName"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="relative overflow-x-auto sm:overflow-x-visible">
          <div className="flex items-center justify-between mb-2 sm:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setVisibleColumnStart(Math.max(0, visibleColumnStart - 1))
              }
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setVisibleColumnStart(
                  Math.min(headers.length - 3, visibleColumnStart + 1)
                )
              }
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Table className="border-collapse w-full">
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead
                    key={index}
                    className={`relative p-0 border-r last:border-r-0 ${
                      index < visibleColumnStart ||
                      index >= visibleColumnStart + 3
                        ? "hidden sm:table-cell"
                        : ""
                    }`}
                  >
                    {editingHeader === index ? (
                      <Input
                        value={header}
                        onChange={(e) => {
                          const newHeaders = [...headers];
                          newHeaders[index] = e.target.value;
                          setHeaders(newHeaders);
                        }}
                        onBlur={() => setEditingHeader(null)}
                        autoFocus
                        className="w-full h-full border-none rounded-none focus:ring-0 text-sm"
                      />
                    ) : (
                      <div className="flex items-center justify-between p-2">
                        <span className="text-sm">{header}</span>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingHeader(index)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          {headers.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeColumn(index)}
                              className="h-6 w-6 p-0 ml-1"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </TableHead>
                ))}
                <TableHead className="w-[50px] p-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={addColumn}
                    className="h-full w-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {row.values.map((cell, index) => (
                    <TableCell
                      key={index}
                      className={`p-0 border-r last:border-r-0 ${
                        index < visibleColumnStart ||
                        index >= visibleColumnStart + 3
                          ? "hidden sm:table-cell"
                          : ""
                      }`}
                    >
                      <Input
                        value={cell}
                        onChange={(e) =>
                          updateCell(row.id, index, e.target.value)
                        }
                        className="w-full h-full border-none rounded-none focus:ring-0 text-sm"
                      />
                    </TableCell>
                  ))}
                  <TableCell className="p-0 w-[50px]">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(row.id)}
                      className="h-full w-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <Button variant="outline" onClick={addRow}>
            Добавить строку
          </Button>
          <Button variant="default" onClick={exportToPDF}>
            <Download className="h-4 w-4 mr-2" />
            Экспорт в PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
